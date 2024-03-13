import { formatISO9075 } from 'date-fns';

export default function Post({ title, summary, cover, createdAt, content, author }) {
  return (
    <div className="post">
      <div className="image">
        <img
          src={'http://localhost:5000/' + cover}
          alt=" xyz"
        />
      </div>
      <div className="texts">
        <h2>{title}</h2>
        <p className="info">
          <a
            href=" "
            className="author">
            {author.username}
          </a>
          <time> {formatISO9075(new Date(createdAt))} </time>
        </p>

        <p className="summary"> {summary} </p>
      </div>
    </div>
  );
}
