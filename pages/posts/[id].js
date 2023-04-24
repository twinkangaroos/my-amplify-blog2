import { withSSRContext } from 'aws-amplify';
import { Post } from '../../models';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';

export default function PostComponent({ post }) {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>{post.title}</h1>
            <Markdown>{post.content}</Markdown>
        </div>
    )
}

export async function getStaticPaths(req) {
    const { DataStore } = withSSRContext(req);
    const posts = await DataStore.query(Post);
    const paths = posts.map(post => ({ params: { id: post.id } }));
    // { params: { id: post.id }}
    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps(req) {
    const { DataStore } = withSSRContext(req);
    const { params } = req;
    const { id } = params;
    const post = await  DataStore.query(Post, id)
    return {
        props: {
            post: JSON.parse(JSON.stringify(post))
        },
        revalidate: 100
    }
}
