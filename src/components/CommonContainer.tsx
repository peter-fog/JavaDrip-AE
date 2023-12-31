import dynamic from 'next/dynamic';
import { FC } from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { RootComponentInstance } from '@uniformdev/canvas';
import { UniformComposition, UniformSlot, createUniformApiEnhancer } from '@uniformdev/canvas-react';
import { GoogleAnalyticsGtag } from './TrackersProvider';
import NavigationFooter from './NavigationFooter';
import NavigationHeader from './NavigationHeader';

const { appVersion } = getConfig().publicRuntimeConfig;

interface LayoutProps {
  preview: boolean;
  composition: RootComponentInstance;
  navigationLinks: Type.NavigationLink[];
  isCommerceApp?: boolean;
}

const CommonContainer: FC<LayoutProps> = ({ composition, preview, navigationLinks, isCommerceApp }) => {
  // Docs: https://docs.uniform.app/reference/packages/uniformdev-canvas-react#createuniformapienhancer
  const contextualEditingEnhancer = createUniformApiEnhancer({ apiUrl: '/api/preview' });

  const { pageMetaTitle, pageMetaDescription } = composition?.parameters || {};

  const title = `${pageMetaTitle?.value} v.${appVersion}`;
  const description = pageMetaDescription?.value as string;

  const renderUniformContextDevTools = () => {
    if (!Boolean(preview)) return null;
    // Docs: https://docs.uniform.app/guides/tools/context-devtools#display-context-devtools
    const UniformContextDevTools = dynamic(() => import('./UniformContextDevTools'), { ssr: false });
    return <UniformContextDevTools />;
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="version" content={appVersion} />
        <meta name="description" property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <GoogleAnalyticsGtag />
      </Head>
      <div>
        {Boolean(composition) && (
          // Docs: https://docs.uniform.app/reference/packages/uniformdev-canvas-react#composition
          <UniformComposition
            data={composition}
            behaviorTracking="onLoad"
            contextualEditingEnhancer={contextualEditingEnhancer}
          >
            <NavigationHeader navigationLinks={navigationLinks} isCommerceApp={isCommerceApp} />
            {/* Docs: https://docs.uniform.app/reference/packages/uniformdev-canvas-react#slot */}
            <UniformSlot name="content" />
            <NavigationFooter />
          </UniformComposition>
        )}
        {renderUniformContextDevTools()}
      </div>
    </>
  );
};

export default CommonContainer;
