import Head from 'next/head';

const NotAuthorized = ()=>{
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Not Authorized</title>
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Not Authorized</h1>
        <p className="text-gray-700 mb-4">
          You do not have permission to access this page.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}


export default NotAuthorized;
