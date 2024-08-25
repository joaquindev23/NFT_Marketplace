// withServerUser.js

import axios from 'axios';
import cookie from 'cookie';

const fetchAuthenticatedUser = async (access) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/me/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export function withServerUser(PageComponent) {
  const WithServerUser = (props) => {
    return <PageComponent {...props} />;
  };

  WithServerUser.getLayout = PageComponent.getLayout;

  WithServerUser.getServerSideProps = async (context) => {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const { access } = cookies;

    const serverUser = access ? await fetchAuthenticatedUser(access) : null;

    const pageProps = PageComponent.getServerSideProps
      ? await PageComponent.getServerSideProps(context)
      : {};

    return {
      props: {
        ...pageProps.props,
        access: access,
        serverUser: serverUser,
      },
    };
  };

  return WithServerUser;
}
