import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { mocked } from 'jest-mock';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/react';

jest.mock('next-auth/react');
jest.mock('../../services/prismic');

const posts = [
    {slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '01 de abril de 2021'}
]

describe('Post page', () => {
    it('renders correctly', () => {
        render(<Post post={{
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Excerpt</p>',
            updatedAt: '01 de abril de 2021'
        }} />);

        expect(screen.getByText("My New Post")).toBeInTheDocument();
        expect(screen.getByText("Post Excerpt")).toBeInTheDocument();
    });
    
    it('redirects user if no subscription is found', async () => {

        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null,
        } as any)

        const response = await getServerSideProps({
            req: {
                cookies: {},
            },
            params: {
                slug: 'my-new-post',
            }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            })
        );

    });

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);

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

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription',
        } as any);

        const response = await getServerSideProps({
            req: {
                cookies: {},
            },
            params: {
                slug: 'my-new-post',
            }
        } as any);

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