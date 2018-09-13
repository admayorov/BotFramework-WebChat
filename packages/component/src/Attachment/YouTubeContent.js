import React from 'react';

import Context from '../Context';

export default ({ autoPlay, embedID, loop }) => {
  const search = new URLSearchParams({
    autoplay: autoPlay ? 1 : 0,
    loop: loop ? 1 : 0,
    modestbranding: 1
  }).toString();

  return (
    <Context.Consumer>
      { ({ styleSet }) =>
        <iframe
          className={ styleSet.youTubeContent }
          src={ `https://youtube.com/embed/${ embedID }?${ search }` }
        />
      }
    </Context.Consumer>
  );
}