import { css } from 'glamor';
import classNames from 'classnames';
import React from 'react';

import { withStyleSet } from '../Context';
import MainContext from '../Context';

const SUGGESTED_ACTION_CSS = css({
  display: 'inline-block',
  whiteSpace: 'initial'
});

export default withStyleSet(({ text, type, value, styleSet }) =>
  <MainContext.Consumer>
    { ({ focusSendBox, onCardAction }) =>
      <div className={ classNames(styleSet.suggestedAction + '', SUGGESTED_ACTION_CSS) }>
        <button onClick={ () => {
          onCardAction({ type, value });
          focusSendBox();
        } }>
          <nobr>{ text }</nobr>
        </button>
      </div>
    }
  </MainContext.Consumer>
)