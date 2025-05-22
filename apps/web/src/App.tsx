import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from './trpc';
import "./App.css";

const queryClient = new QueryClient();

function HelloTrpc() {
	const { data, isLoading } = trpc.hello.useQuery({ name: '스무디' });
	if (isLoading) return <div>로딩 중...</div>;
	return <div>{data?.greeting}</div>;
}

function UserTrpc() {
	const { data, isLoading } = trpc.getUser.useQuery({ id: '1' });
	if (isLoading) return <div>로딩 중...</div>;
	return <div>{data?.id}</div>;
}

function App() {
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<h1>tRPC React 예제</h1>
				<HelloTrpc />
				<UserTrpc />
			</QueryClientProvider>
		</trpc.Provider>
	);
}

export default App;
