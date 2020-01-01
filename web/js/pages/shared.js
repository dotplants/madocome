import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import QueryTypes from '@yuzulabo/query-types';
import { getStringData } from '../utils/config';

const types = {
  version: PropTypes.number.isRequired,
  videos: QueryTypes.arrayWithLength(0, 16),
  config: PropTypes.object
};

const Shared = () => {
  const { formatMessage } = useIntl();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const data = decodeURIComponent(location.search.slice(1));
    if (
      getStringData() &&
      !confirm(formatMessage({ id: 'pages.shared.note' }))
    ) {
      return;
    }

    try {
      const parsed = JSON.parse(data);
      const { valid, errors } = QueryTypes.check(types, parsed);
      if (!valid) {
        console.error(errors);
        alert(formatMessage({ id: 'pages.shared.error_verify' }));
        return;
      }

      localStorage.setItem('live_viewer_config', JSON.stringify(parsed));
      setReady(true);
    } catch (e) {
      console.error(e);
      alert(formatMessage({ id: 'pages.shared.error_broken' }));
    }
  }, []);

  if (ready) {
    return <Redirect to="/" />;
  }

  return <div>ちょっと待っててね</div>;
};

export default Shared;
