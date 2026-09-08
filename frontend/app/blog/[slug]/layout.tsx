import { Metadata } from 'next';
import { API_URL, SITE_URL } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams?.slug;
        const primaryUrl = API_URL || 'https://backend-flax-eight-93.vercel.app';
        const fallbackUrl = 'https://backend-flax-eight-93.vercel.app';

        let post = null;
        try {
            const res = await fetch(`${primaryUrl}/api/blog/${slug}`, { next: { revalidate: 3600 } });
            if (res.ok) post = await res.json();
        } catch (e) {}

        if (!post && primaryUrl !== fallbackUrl) {
            try {
                const res = await fetch(`${fallbackUrl}/api/blog/${slug}`, { next: { revalidate: 3600 } });
                if (res.ok) post = await res.json();
            } catch (e) {}
        }
        
        if (!post) {
            return {
                title: 'Post Not Found | Weekend Travellers',
            };
        }

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
