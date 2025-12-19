import axios from 'axios';
import { UnauthorizedException } from '@nestjs/common';

const postRequest = async (url: string, headers: any, data: any) => {
  return await axios.post(url, data, {
    headers,
  });
};

const deleteRequest = async (url: string, headers: any) => {
  return await axios.delete(url, {
    headers,
  });
};

const extractCredentials = (
  authHeader: string,
): { username: string; password: string } => {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    throw new UnauthorizedException('Missing or invalid Authorization header');
  }

  try {
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');

    if (!username || !password) {
      throw new UnauthorizedException('Invalid credentials format');
    }

    return { username, password };
  } catch (error) {
    throw new UnauthorizedException('Invalid Authorization header');
  }
};

export { postRequest, deleteRequest, extractCredentials };
