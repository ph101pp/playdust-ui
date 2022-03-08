import esb from 'elastic-builder'
import type { NextApiRequest, NextApiResponse } from 'next'
import postQuery from '../../src/search/api/helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Promise<any>>
) => {
  const mintAddress = req.query.address

  if (typeof mintAddress === 'string') {
    const requestBody = esb
      .requestBodySearch()
      .query(esb.matchQuery('mint', mintAddress))
      .toJSON()
    const result = await postQuery(requestBody)
    const source = result?.hits?.hits[0]?._source

    res.status(200).json(source)
  } else {
    res.status(400)
  }
}

export default handler
