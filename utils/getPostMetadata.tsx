import fs from "fs";
import matter from "gray-matter";

// Define the interface for the post metadata
interface PostMetaData {
    title: string;
    description: string;
    date: string;
    published: boolean;
    url: string;
    slug: string;
    type: string;
    tags: string;
}

export default function getPostMetaData(basePath: string): PostMetaData[] {
    const folder = basePath + "/";
    const files = fs.readdirSync(folder);
    const markdownPosts = files.filter(file => file.endsWith('.mdx'));

    // Get the file data
    const posts = markdownPosts.map((filename) => {
        const fileContents = fs.readFileSync(`${basePath}/${filename}`, 'utf-8')
        const matterResult = matter(fileContents)
        return {
            title: matterResult.data.title,
            description: matterResult.data.description,
            date: matterResult.data.date,
            published: matterResult.data.published,
            url: matterResult.data.url,
            slug: filename.replace(".mdx", ""),
            type: matterResult.data.type,
            tags: matterResult.data.tags,
        }
    });
    return posts;
}