import Header from '@/components/Header/Header';

interface PageLayoutProps {
	children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-col px-[1rem] md:px-[5rem] h-screen">
			<Header />

			<main className="flex flex-col flex-1 w-full min-h-0">{children}</main>
		</div>
	);
};

export default PageLayout;
