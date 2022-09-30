import { render, screen } from '@testing-library/react';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { mocked } from 'jest-mock';
import { getPrismicClient } from '../../services/prismic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

jest.mock('next-auth/react');
jest.mock('../../services/prismic');
jest.mock('next/router');

const posts = [
    {slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '01 de abril de 2021'}
]

describe('Post preview page', () => {

    it('renders correctly', () => {

        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated'
        });

        render(<Post post={{
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Excerpt</p>',
            updatedAt: '10 de abril'
        }} />);

        expect(screen.getByText("My New Post")).toBeInTheDocument();
        expect(screen.getByText("Post Excerpt")).toBeInTheDocument();
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    });
    
    it('redirects user to full post when user is subscribed', async () => {

        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce({
            data: { 
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires',
            },
            status: 'authenticated'
        });

        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any)

        render(<Post post={{
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Excerpt</p>',
            updatedAt: '10 de abril'
        }} />);

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')

    });
    
    it('loads initial data', async () => {

        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title:[
                        { type: 'heading', text: 'My new post'}
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post Excerpt'}
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        }as any);

        const response = await getStaticProps({ params: {slug:'my-new-post'}});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post Excerpt</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        );
    })
    
})