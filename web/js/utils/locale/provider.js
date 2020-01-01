import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import ObjectFlatten from './flatten';

const locales = {
  ja: ObjectFlatten(require('../../../locale/ja'))
};

const I18nProvider = props => {
  const { locale, children, ...prop } = props;

  return (
    <IntlProvider locale={locale} messages={locales[locale]} {...prop}>
      {children}
    </IntlProvider>
  );
};

I18nProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default I18nProvider;
