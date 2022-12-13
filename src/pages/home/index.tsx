import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Main = dynamic(() => import('~/components/page/Home'), {
  ssr: false,
});

const Home: NextPage = () => <Main />;

export default Home;
