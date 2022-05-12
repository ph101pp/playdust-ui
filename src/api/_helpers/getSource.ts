import type OpenSearchResponseType from '../_types/OpenSearchResponseType';

const getSource = (results: OpenSearchResponseType<unknown>) => {
  const sources = results.hits.hits.map((entry) => entry._source);

  return sources;
};

export default getSource;
