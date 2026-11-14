export function Details() {
  return (
    <main id="content" className="details-page" aria-label="Wedding weekend details">
      <section className="wedding-event" aria-labelledby="welcome-party-title">
        <header className="event-heading">
          <p className="event-date"><time dateTime="2027-10-01">Friday, October 1, 2027</time></p>
          <h2 id="welcome-party-title">Welcome Party with Dinner</h2>
        </header>
        <div className="event-when">
          <p className="event-venue">Location TBD</p>
          <p className="event-time"><time dateTime="2027-10-01T18:00">~6:00 PM</time></p>
        </div>
        <p className="event-followup">More details to follow. We plan for the event to be within a few minutes drive of downtown Burlington.</p>
      </section>
      <div className="event-divider" aria-hidden="true" />
      <section className="wedding-event" aria-labelledby="ceremony-title">
        <header className="event-heading">
          <p className="event-date"><time dateTime="2027-10-02">Saturday, October 2, 2027</time></p>
          <h2 id="ceremony-title">Wedding Ceremony &amp; Reception</h2>
        </header>
        <div className="event-location">
          <img
            className="event-photo"
            src="/images/mercantile-hall-tables.jpg"
            width="1080"
            height="720"
            alt="Wedding reception tables set inside Mercantile Hall, with exposed brick walls and wooden floors"
            decoding="async"
          />
        </div>
        <div className="event-when">
          <p className="event-venue">Mercantile Hall</p>
          <p className="event-time"><time dateTime="2027-10-02T16:30">4:30 PM</time></p>
          <address className="event-address">425 N Pine St<br />Burlington, WI 53105</address>
        </div>
        <p className="event-followup">Please arrive and be seated by 4:20 PM, so that the ceremony can begin on time. Cocktail hour, dinner, and dancing to follow!</p>
        <div className="event-attire">
          <p className="event-attire-label">Cocktail attire</p>
        </div>
      </section>
    </main>
  );
}
