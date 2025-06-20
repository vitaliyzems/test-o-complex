import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

type Review = {
  id: number;
  text: string;
};

export default async function Reviews() {
  const res = await fetch('http://o-complex.com:1337/reviews', {
    cache: 'no-store',
  });
  const reviews: Review[] = await res.json();

  return (
    <section className="flex flex-col gap-4">
      {reviews.map((review) => (
        <article
          className="review bg-foreground p-4 rounded-[15px]"
          key={review.id}
          dangerouslySetInnerHTML={{
            __html: purify.sanitize(review.text),
          }}
        />
      ))}
    </section>
  );
}
