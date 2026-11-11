type WeddingPartyMember = {
  name: string;
  role?: string;
  desc?: string;
  imageUrl?: string;
  imagePosition?: string;
  imageZoom?: number;
};

const weddingParty: WeddingPartyMember[] = [
  { 
    role: 'Maid of Honor', 
    name: 'Katie Eisenman',
    desc: 'Sarah’s favorite (and only) sister and best friend since day one!'
  },
  {
    role: 'Best Man',
    name: 'Jack Gasper',
    desc: 'Guy’s favorite (and only) brother and built-in bestie!',
    imageUrl: '/images/jack-gasper.jpg',
    imagePosition: '65% 29%',
    imageZoom: 1.78
  },
  {
    name: 'Annie Gasper',
    desc: 'Guy’s eldest younger sister and the creative mind in the Gasper family!'
  },
  {
    name: 'Megan Gasper',
    desc: 'Guy’s youngest and spunkiest sibling!',
    imageUrl: '/images/megan-gasper.jpg',
    imagePosition: '45% 47%',
    imageZoom: 1.85
  },
  {
    name: 'Hannah Jumper',
    desc: 'Sarah’s bestie for nearly 15 years, Hannah and Sarah met as campers at Girl Scout camp!',
    imageUrl: '/images/hannah-jumper.JPG',
    imagePosition: '40% 7%',
    imageZoom: 1.07
  },
  {
    name: 'Sarah Johnson',
    desc: 'Sarah’s randomly assigned freshman year roommate at Northwestern University turned bestie!',
    imageUrl: '/images/sarah-johnson.jpg',
    imagePosition: '34% 2%',
    imageZoom: 1.78
  },
  {
    name: 'Will Lowry',
    desc: 'Guy’s bestie since college after bonding over Gossip Girl as roommates!'
  },
  {
    name: 'Alex Hearn',
    desc: 'Guy’s best friend since middle school soccer!',
    imageUrl: '/images/alex-hearn.PNG',
    imagePosition: '31% 41%',
    imageZoom: 1.65
  },
  {
    role: 'Officiant',
    name: 'Abby Smith',
    desc: 'Sarah’s unofficial big sister from Northwestern University!'
  },
  {
    role: 'Parents of the Bride',
    name: 'Joanne McAndrews & Larry Eisenman',
    imageUrl: '/images/joanne-larry.jpg',
    imagePosition: '48% 81%',
    imageZoom: 1.15
  },
  {
    role: 'Parents of the Groom',
    name: 'Whitney & Ed Gasper',
  }
];

export function WeddingParty() {
  return (
    <main id="content" className="party-page" aria-label="Wedding Party">
      <ul className="party-list" role="list">
        {weddingParty.map(({ role, name, desc, imageUrl, imagePosition, imageZoom }) => (
          <li className="party-member" key={name}>
            <div className="party-portrait" aria-hidden="true">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: imagePosition,
                    transformOrigin: imagePosition,
                    scale: imageZoom,
                  }}
                />
              )}
            </div>
            <div className="party-member-details">
              <h2>{name}</h2>
              {role && <p className="party-role">{role}</p>}
              {desc && <p className="party-description">{desc}</p>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
