import styled from '@emotion/styled';
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useDebounceCallback } from '@react-hook/debounce';
import { useSelect } from 'downshift';
import parse from 'html-react-parser';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AutosizeInput from 'react-input-autosize';
import { useClickAway } from 'react-use';
import { AutoSizer, ListRowRenderer } from 'react-virtualized';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import SkeletonRows from '../SkeletonRows';
import QueryNodeChip from './QueryNodeChip/QueryNodeChip';
import RenderQuery from './RenderQuery/RenderQuery';
import VirtualizedList from './VirtualizedList';
import searchQueryDebouncedTermAtom from './_atoms/searchQueryDebouncedTermAtom';
import searchQueryTermAtom from './_atoms/searchQueryTermAtom';
import searchSuggestionsAtom from './_atoms/searchSuggestionsAtom';
import useOnSuggestionChange from './_hooks/useOnSuggestionChange';
import useWindowInputKeyEvent from './_hooks/useWindowInputKeyEvent';

const RootContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-wrap: wrap;
  padding: 0 8px;
  font-size: 80%;
  background: none;
  cursor: text;
`;

const OverlayContainer = styled(Paper)`
  position: absolute;
  width: 100%;
`;

const EmptyContainer = styled.div`
  display: flex;
  min-height: 48px;
  align-items: center;
`;

function WindowInput() {
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const [term, setTerm] = useRecoilState(searchQueryTermAtom);
  const setDTerm = useSetRecoilState(searchQueryDebouncedTermAtom);
  const setDebouncedTerm = useDebounceCallback(setDTerm, 500);
  const theme = useTheme();
  const isActive = !!activeNodeMeta;
  const borderColor = isActive
    ? theme.palette.primary.main
    : theme.palette.grey[400];
  const borderWidth = isActive ? 1.5 : 1;
  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInputRef = useCallback((inputElement: HTMLInputElement | null) => {
    inputRef.current = inputElement;
  }, []);

  const [activeIdx, setActiveIdx] = useState(0);
  const { suggestions, loading } = useRecoilValue(searchSuggestionsAtom);
  const lastSuggestionIdx = suggestions.length - 1;
  const onSuggestionChange = useOnSuggestionChange();

  useClickAway(containerRef, () => {
    setActiveNodeMeta(null);
  });

  useEffect(() => {
    setActiveIdx(0);
  }, [activeNodeMeta]);

  useWindowInputKeyEvent();

  const {
    isOpen,
    getItemProps,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
  } = useSelect({
    items: suggestions,
    isOpen: suggestions.length > 0,
    highlightedIndex: activeIdx,
  });

  const textInput = (
    <AutosizeInput
      key="auto-size-input"
      inputStyle={{
        fontFamily: 'inherit',
        border: 'none',
        outline: 'none',
        background: 'inherit',
      }}
      inputRef={setInputRef}
      value={term}
      placeholder={rootNode ? undefined : 'Search...'}
      onChange={(evt) => {
        if (activeIdx !== 0) {
          setActiveIdx(0);
        }
        setTerm(evt.target.value);
        setDebouncedTerm(evt.target.value);
      }}
      autoFocus={true}
      onClick={(e) => e.stopPropagation()}
      onBlur={() => {
        if (suggestions.length > 0) {
          inputRef?.current?.focus();
        }
      }}
      onKeyDown={(evt) => {
        switch (evt.key) {
          case 'ArrowUp':
            return setActiveIdx(
              activeIdx === 0 ? lastSuggestionIdx : activeIdx - 1
            );
          case 'ArrowDown':
            return setActiveIdx(
              activeIdx === lastSuggestionIdx ? 0 : activeIdx + 1
            );
          case 'Enter':
            return onSuggestionChange(suggestions[highlightedIndex]);
          default:
        }
      }}
    />
  );

  const rowRenderer = useCallback<ListRowRenderer>(
    ({ index, key, style }) => {
      const suggestion = suggestions[index];
      const isActiveSuggestion = highlightedIndex === index;

      return (
        <div key={key} style={style}>
          <Typography
            {...getItemProps({ item: suggestion, index })}
            onMouseMove={undefined}
            sx={{
              paddingX: 3,
              paddingY: 0.5,
              height: '100%',
              fontSize: '80%',
              cursor: 'pointer',
              background: isActiveSuggestion ? theme.palette.grey[200] : 'auto',
              '&:hover': {
                background: isActiveSuggestion
                  ? 'auto'
                  : theme.palette.grey[100],
              },
            }}
            onClick={() => onSuggestionChange(suggestion)}
          >
            {parse(suggestion.label)}
          </Typography>
        </div>
      );
    },
    [getItemProps, highlightedIndex, onSuggestionChange, suggestions, theme]
  );

  const rowHeight = 30;
  const maxHeight = window.innerHeight * 0.5;

  return (
    <RootContainer ref={containerRef}>
      <InputContainer
        sx={{
          border: 'solid',
          borderColor,
          borderWidth,
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
        }}
        {...getToggleButtonProps()}
        onClick={() => {
          if (rootNode) {
            setActiveNodeMeta({
              type: 'group',
              nodeId: rootNode.id,
              index: rootNode.children.length,
            });
          }
          inputRef?.current?.focus();
        }}
      >
        {rootNode ? (
          <RenderQuery
            renderQueryNode={(queryNode) => (
              <QueryNodeChip node={queryNode} textInput={textInput} />
            )}
            renderTextInput={() => <QueryNodeChip textInput={textInput} />}
          />
        ) : (
          <EmptyContainer>{textInput}</EmptyContainer>
        )}
      </InputContainer>
      <OverlayContainer elevation={isOpen ? 8 : 0} {...getMenuProps()}>
        {isOpen && (
          <>
            <AutoSizer disableHeight={true}>
              {({ width }) => (
                <VirtualizedList
                  height={Math.min(maxHeight, suggestions.length * rowHeight)}
                  width={width}
                  rowCount={suggestions.length}
                  rowRenderer={rowRenderer}
                  rowHeight={30}
                  overscanRowCount={4}
                  scrollToIndex={highlightedIndex}
                />
              )}
            </AutoSizer>
            {loading && (
              <Stack sx={{ px: 3 }}>
                <SkeletonRows rows={2} />
              </Stack>
            )}
          </>
        )}
      </OverlayContainer>
    </RootContainer>
  );
}

export default WindowInput;