const weddingParty = [
  { role: 'Bridesmaid', names: ['Hannah', 'Annie', 'Megan', 'Sarah', 'Katie'] },
  { role: 'Groomsman', names: ['Jack', 'Alex', 'Will'] },
];

export function WeddingParty() {
  return (
    <main id="content" className="party-page">
      <h1>Wedding Party</h1>
      <ul className="party-list" role="list">
        {weddingParty.flatMap(({ role, names }) => names.map((name) => (
          <li className="party-member" key={name}>
            <div className="party-portrait" aria-hidden="true" />
            <div className="party-member-details">
              <h2>{name}</h2>
              <p className="party-role">{role}</p>
              <p className="party-description">TODO: Fill in details</p>
            </div>
          </li>
        )))}
      </ul>
    </main>
  );
}
