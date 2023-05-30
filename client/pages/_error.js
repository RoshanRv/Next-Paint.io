import React from 'react';

const ErrorPage = ({ statusCode }) => {
  return (
    <div>
      <h1>Error {statusCode}</h1>
      {/* Aquí puedes personalizar el mensaje de error */}
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
