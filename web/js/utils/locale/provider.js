import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import ObjectFlatten from './flatten';
import Container from '../../container';

const locales = {
  ja: ObjectFlatten(require('../../../locale/ja')),
  en: ObjectFlatten(require('../../../locale/en'))
};

const I18nProvider = props => {
  const { conf } = Container.useContainer();
  const { children, ...prop } = props;
  const browserLanguage = (
    navigator.browserLanguage ||
    navigator.language ||
    ''
  )
    .toLowerCase()
    .substr(0, 2);
  const locale =
    conf?.language || (locales[browserLanguage] && browserLanguage) || 'ja';

  return (
    <IntlProvider locale={locale} messages={locales[locale]} {...prop}>
      {children}
    </IntlProvider>
  );
};

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default I18nProvider;
