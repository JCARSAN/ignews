import {  GetStaticPaths, GetStaticProps } from "next";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import Head from 'next/head';
import styles from '../post.module.scss';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }:PostPreviewProps){
    const session = useSession()
    const router = useRouter()

    console.log('Preview slug - session: ',session);

    useEffect(() => {
        if(session.data?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    })

    return (
        <>
          <Head>
            <title>{post.title}</title>
          </Head>

          <main className={styles.container}>
            <article className={styles.post}>
                <h1>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div 
                   className={`${styles.postContent} ${styles.previewContent}`}
                   dangerouslySetInnerHTML={{ __html: post.content}} 
                />

                <div className={styles.continueReading}>
                    Wanna continue reading?
                    <Link href="/">
                        <a>Subscribe now 🤗</a>
                    </Link>
                </div>
            </article>
          </main>
        </>
    );
}

//Quais posts serão gerados durante o comando build.
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

/* No caso, o post os-feitos-de-perseu---parte-2 será pré-carregado.
 export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { slug: 'os-feitos-de-perseu---parte-2'}}
        ],
        fallback: 'blocking'
    }
}
*/

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient();

    const response = await prismic.getByUID('post',String(slug), {});

    const post = {
        slug,
        title: response.data.title,
        content: RichText.asHtml(response.data.content.splice(0,3)),
        updatedAt : new Date(response.last_publication_date).toLocaleDateString('pt-BR', {day:'2-digit', month:'long', year:'numeric'})
    }

    return {
        props: { post, },
        redirect: 60 * 30 // 30 minutos
    }
}