// prettier-ignore
import { COOPART_ADDRESS } from "dapp/defaults";
import { Page } from 'styles'

import { HelpView } from './Help.view'

export const Help = () => {
  return (
    <Page>
      <HelpView contractAddress={COOPART_ADDRESS} />
    </Page>
  )
}
