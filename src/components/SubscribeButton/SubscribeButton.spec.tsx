import { render, screen, fireEvent } from '@testing-library/react';
import { Session } from 'inspector';
import { mocked } from 'jest-mock';
import { useSession, signIn } from 'next-auth/react';
import { SubscribeButton } from '.';
import { useRouter } from "next/router";

jest.mock('next-auth/react', () => {
    return{
        signIn: jest.fn()
    }
})

jest.mock('next/router', () => {
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    })
})

describe('SubscribeButton component', () => {

    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated'
        });

        render( <SubscribeButton /> )
    
        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('renders correctly when user is not authenticated', () => {
        const signInMocked = mocked(signIn);

        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated'
        });

        render( <SubscribeButton /> )
        
        const subscribeButton = screen.getByText('Subscribe now')

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts when user already has a subscription', () => {

        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValue({
            data: { 
                user: {name: 'Jonh Doe', email: 'jonh.doe@example.com'},
                activeSubscription: 'fake-active-subscription',
                expires:'fake-expires'
            },
            status: 'authenticated'
        });

        useRouterMocked.mockReturnValueOnce({
            push: jest.fn(),
        }as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWidth('/posts');
    });
})