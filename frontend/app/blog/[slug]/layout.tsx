import { Metadata } from 'next';
import { API_URL, SITE_URL } from '@/lib/config';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        // Fetch the blog post data from the API
        const res = await fetch(`${API_URL}/api/blog/${params.slug}`, { next: { revalidate: 3600 } });
        
        if (!res.ok) {
            return {
                title: 'Post Not Found | Weekend Travellers',
            };
        }
        
        const post = await res.json();

        return {
            title: `${post.title} | Weekend Travellers`,
            description: post.metaDescription,
            keywords: [post.keyword, 'travel blog', 'Weekend Travellers'],
            openGraph: {
                title: post.title,
                description: post.metaDescription,
                url: `${SITE_URL}/blog/${post.slug}`,
                siteName: 'Weekend Travellers',
                images: [
                    {
                        url: post.heroImage,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                type: 'article',
                publishedTime: post.publishedDate,
                authors: [post.author],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.metaDescription,
                images: [post.heroImage],
            },
            alternates: {
                canonical: `${SITE_URL}/blog/${post.slug}`,
            }
        };
    } catch (error) {
        console.error('Error generating metadata for blog post:', error);
        return {
            title: 'Travel Blog | Weekend Travellers',
        };
    }
}

export default function BlogPostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
