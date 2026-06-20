import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import GlobalAuthModal from './global-auth-modal';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Router from '@/router';

import '@/utils/i18n';
import Fallback from './components/Fallback';
import { basicMetaAckAiModels } from './rest/meta';
import ErrorFallback from './components/ErrorFallback';
import { ModalProvider } from './context/useModalContext';
import { AckAiModelsContext } from './context/useAckAiModels';
import { useHandleServer } from './hooks/Server/useHandleServer';
import NotificationProvider from './components/Notification/NotificationProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 30,
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			refetchOnMount: true,
		},
	},
});

const App = () => {
	return (
		<ErrorBoundary fallback={<ErrorFallback />}>
			<Suspense fallback={<Fallback />}>
				<Router />
			</Suspense>
		</ErrorBoundary>
	);
};

const Root = () => {
	const { data } = useHandleServer(['respMetaAckAiModels'], basicMetaAckAiModels, { refetchInterval: 30000 });

	return (
		<AckAiModelsContext.Provider value={data?.status ?? 2}>
			<NotificationProvider />

			<App />
		</AckAiModelsContext.Provider>
	);
};

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<ModalProvider>
					<Root />

					{/* AuthModal */}
					<GlobalAuthModal />

					<ReactQueryDevtools initialIsOpen={true} />
				</ModalProvider>
			</QueryClientProvider>
		</HelmetProvider>
	</BrowserRouter>
);
