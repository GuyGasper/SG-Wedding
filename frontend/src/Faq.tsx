type FaqItem = {
  question: string;
  answer: string;
  link?: { text: string; href: string };
};

export const faqItems: FaqItem[] = [
  {
    question: 'Where is the wedding?',
    answer: 'We’re celebrating at Mercantile Hall, 425 N Pine St, Burlington, WI 53105.'
  },
  {
    question: 'What time does the ceremony begin?',
    answer: 'The ceremony begins at 4:30 PM on Saturday, October 2, 2027. Cocktail hour, dinner, and dancing will follow!'
  },
  {
    question: 'What should I wear to the wedding?',
    answer: 'Cocktail attire for the wedding - feel free to be on the fancier end or more casual. We want you to be comfortable! Please no athletic shoes, jeans, or shorts. You may wish to bring a jacket or light wrap to stay cozy depending on the weather.'
  },
  {
    question: 'What should I wear to the welcome party?',
    answer: 'The welcome party is casual - wear whatever you’d like!'
  },
  {
    question: 'What are your wedding colors?',
    answer: 'Our wedding colors are lavender, sage, and other shades of purple and green. We encourage your outfit to be as colorful as you wish!'
  },
  {
    question: 'Where should I stay?',
    answer: 'You’ll find hotel options, room block links, and driving times on our Travel and Accommodation page.'
  },
  {
    question: 'Is parking available at the venue?',
    answer: 'There is a free parking structure ~5 minute walk from Mercantile Hall at 224 E Washington St, across from the Hampton Inn Burlington. If you are staying at the Hampton Inn Burlington, be sure to park in the designated guest spots. Here is a map for reference: ',
    link: {
      text: 'https://www.burlington-wi.gov/DocumentCenter/View/1692/Downtown-Parking-Map---2026',
      href: 'https://www.burlington-wi.gov/DocumentCenter/View/1692/Downtown-Parking-Map---2026',
    }
  },
  {
    question: 'How should I share dietary needs or allergies?',
    answer: 'We will be collecting dietary information during the RSVP process.'
  },
  {
    question: 'When should I RSVP?',
    answer: 'RSVPs will open once we send out invitations.'
  },
  {
    question: 'Who can I contact with questions?',
    answer: 'You can reach out to us at our wedding email address:',
    link: {
      text: 'weddingsg2027@gmail.com',
      href: 'mailto:weddingsg2027@gmail.com',
    }
  },
  {
    question: 'Can I bring children?',
    answer: 'We love children, but we will be celebrating with just adults this time.'
  },
  {
    question: 'Can I bring a plus-one?',
    answer: 'Your invitation will indicate whether you are invited with a plus-one. If you have any questions, please reach out to us at our wedding email.'
  },
  {
    question: 'Will we be indoors or outdoors?',
    answer: 'The venue contains both indoor and outdoor spaces. We hope to have the ceremony outdoors, but we will move indoors if the weather is not favorable. After the ceremony, both the indoor and outdoor spaces will be open all night.'
  }
];

export function Faq() {
  return (
    <main id="content" className="faq-page" aria-label="FAQ">
      <div className="faq-list">
        {faqItems.map(({ question, answer, link }, index) => (
          <section className="faq-item" key={question} aria-labelledby={'faq-question-' + index}>
            <h2 id={'faq-question-' + index}>{question}</h2>
            <p>
              {answer}
              {link && <> <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{link.text}</a></>}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
