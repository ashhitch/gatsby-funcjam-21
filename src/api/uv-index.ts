import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

export default function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  //https://www.openuv.io/
  console.log(`submitted form`, req.body)
  res.json(`ok`)
}