import { useContext } from 'react';
import { SessionContext } from '@/provider/SessionProvider';

export const useSession = () => useContext(SessionContext);
