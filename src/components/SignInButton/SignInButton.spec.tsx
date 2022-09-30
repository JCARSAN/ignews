import { render, screen } from '@testing-library/react';
import { Session } from 'inspector';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';
import { SignInButton } from '.';

jest.mock('next-auth/react')

describe('SignInButton component', () => {

    it('renders correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated'
        });

        render( <SignInButton /> )
    
        expect(screen.getByText('SignIn with Github')).toBeInTheDocument();
    });

    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValue({
            data: { 
                user: {name: 'Jonh Doe', email: 'jonh.doe@example.com'},expires:'fake-expires'
            },
            status: 'authenticated'
        });

        render(
            <SignInButton />
        )
    
        expect(screen.getByText('Jonh Doe')).toBeInTheDocument();
    });
})