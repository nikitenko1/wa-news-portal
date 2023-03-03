import Link from 'next/link';

const RelateBlog = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <div className="relate-blog-item my-2 d-flex" role="button">
        <div>
          <img
            src={blog.url}
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'cover',
            }}
            alt="..."
          />
        </div>
        <div className="text-break ms-1">
          <span className="badge rounded bg-success">{blog.topic}</span>
          <p>
            {blog.title.length > 40
              ? blog.title.substring(0, 40) + '...'
              : blog.title}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RelateBlog;
