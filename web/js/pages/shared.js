import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import QueryTypes from '@yuzulabo/query-types';
import { getStringData } from '../utils/config';

const types = {
  version: PropTypes.number.isRequired,
  footer_is_small: PropTypes.bool,
  hide_side: PropTypes.bool,
  videos: QueryTypes.arrayWithLength(0, 16)
};

const Shared = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const data = decodeURIComponent(location.search.slice(1));
    if (
      getStringData() &&
      !confirm('この設定を適用すると、現在の設定は失われます。よろしいですか？')
    ) {
      return;
    }

    try {
      const parsed = JSON.parse(data);
      const { valid, errors } = QueryTypes.check(types, parsed);
      if (!valid) {
        console.error(errors);
        alert('この設定は不正なため使用できません。');
        return;
      }

      localStorage.setItem('live_viewer_config', JSON.stringify(parsed));
      setReady(true);
    } catch (e) {
      console.error(e);
      alert('この設定は壊れているため使用できません。');
    }
  }, []);

  if (ready) {
    return <Redirect to="/" />;
  }

  return <div>ちょっと待っててね</div>;
};

export default Shared;
