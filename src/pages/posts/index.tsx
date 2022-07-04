import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss'
import { GetStaticProps } from 'next/types';
import { RichText } from 'prismic-dom';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostProps {
    posts: Post[];
}

export default function Posts({ posts }: PostProps){
    //console.log("Posts na function POsts: ",posts);
    return(
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head> 

            <main className={styles.container}>
                <div className={styles.posts}>
                { 
                
                  posts.map(post => (
                    <a key={post.slug} href="#">
                        <time>{post.updatedAt}</time> 
                        <strong>{post.title}</strong> 
                        <p>{ post.excerpt }</p> 
                    </a> 
                  )) 
                               
                }  
                </div>    
            </main>  
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismicData = getPrismicClient()
 
    //console.log('Home getStaticProps: ',prismicData)

    /*
    const response = await prismicData.getAllByType(
        Prismic.predicates.at('document.type', 'Posts')
       , {
         fetch: ['Posts.title','Posts.content'],
         pageSize: 100,
       }
    )
    */
    const response = await prismicData.getAllByType('post');

    //console.log("Response: ",JSON.stringify(response, null,2));

    const posts = response.map(post => {
        
        //console.log("Post em maps: ",JSON.stringify(post, null,2));
        return{
            slug      : post.uid,
            title     : post.data.title,
            excerpt   : post.data.content.find(content => (content.type= "paragraph" && content.text !=""))?.text ?? '',
            updatedAt : new Date(post.last_publication_date).toLocaleDateString('pt-BR', {day:'2-digit', month:'long', year:'numeric'})
        }
        
    })

    console.log("Posts: ",posts);

    return {
        props:  { posts }      
    }
}