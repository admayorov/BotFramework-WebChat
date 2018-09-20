import { css } from 'glamor';
import classNames from 'classnames';
import React from 'react';

import BasicSendBox from './SendBox/BasicSendBox';
import BasicTranscript from './Transcript/BasicTranscript';
import Composer from './Composer';
import ErrorBox from './ErrorBox';
import TypeFocusSinkBox from './Utils/TypeFocusSink';

import createCoreActivityMiddleware from './Middleware/Activity/core';
import createAdaptiveCardsAttachmentMiddleware from './Middleware/Attachment/adaptiveCard';
import createCoreAttachmentMiddleware from './Middleware/Attachment/core';
import createMiddlewareStack from './Middleware/createMiddlewareStack';

const ROOT_CSS = css({
  display: 'flex',
  flexDirection: 'column'
});

const TRANSCRIPT_CSS = css({
  flex: 1,
  overflowY: 'auto'
});

const SEND_BOX_CSS = css({
  flexShrink: 0
});

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.sendBoxRef = React.createRef();

    this.refreshActivityRenderer(props.activityMiddleware);
    this.refreshAttachmentRenderer(props.attachmentMiddleware);
  }

  // TODO: [P2] Move to React 16 APIs
  componentWillReceiveProps({ activityMiddleware, attachmentMiddleware }) {
    if (this.props.activityMiddleware !== activityMiddleware) {
      this.refreshActivityRenderer(activityMiddleware);
    }

    if (this.props.attachmentMiddleware !== attachmentMiddleware) {
      this.refreshAttachmentRenderer(attachmentMiddleware);
    }
  }

  refreshActivityRenderer(additionalMiddleware) {
    const activityMiddleware = createMiddlewareStack(
      {},
      [
        ...additionalMiddleware || [],
        createCoreActivityMiddleware(),
        () => () => ({ activity }) => () =>
          <ErrorBox message="No renderer for this activity">
            <pre>{ JSON.stringify(activity, null, 2) }</pre>
          </ErrorBox>
      ]
    );

    this.activityRenderer = (...args) => {
      try {
        return activityMiddleware.run(...args);
      } catch (err) {
        return (
          <ErrorBox message="Failed to render activity">
            <pre>{ JSON.stringify(err, null, 2) }</pre>
            <pre>{ JSON.stringify(activity, null, 2) }</pre>
          </ErrorBox>
        );
      }
    };
  }

  refreshAttachmentRenderer(additionalMiddleware) {
    const attachmentMiddleware = createMiddlewareStack(
      {},
      [
        ...additionalMiddleware || [],
        createCoreAttachmentMiddleware(),
        () => () => ({ attachment }) =>
          <ErrorBox message="No renderer for this attachment">
            <pre>{ JSON.stringify(attachment, null, 2) }</pre>
          </ErrorBox>
      ]
    );

    this.attachmentRenderer = (...args) => {
      try {
        return attachmentMiddleware.run(...args);
      } catch (err) {
        return (
          <ErrorBox message="Failed to render attachment">
            <pre>{ JSON.stringify(err, null, 2) }</pre>
            <pre>{ JSON.stringify(attachment, null, 2) }</pre>
          </ErrorBox>
        );
      }
    }
  }

  render() {
    const { props } = this;

    // TODO: [P2] Implement "scrollToBottom" feature

    return (
      <Composer
        activityRenderer={ this.activityRenderer }
        attachmentRenderer={ this.attachmentRenderer }
        sendBoxRef={ this.sendBoxRef }
        { ...props }
      >
        { ({ styleSet }) =>
          <TypeFocusSinkBox
            className={ classNames(ROOT_CSS + '', styleSet.root + '', (props.className || '') + '') }
            sendFocusRef={ this.sendBoxRef }
          >
            <BasicTranscript className={ TRANSCRIPT_CSS + '' } />
            <BasicSendBox className={ SEND_BOX_CSS } />
          </TypeFocusSinkBox>
        }
      </Composer>
    );
  }
}
