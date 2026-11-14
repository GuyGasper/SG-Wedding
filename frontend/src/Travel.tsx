import { useEffect, useState } from 'react';

type Hotel = {
  name: string;
  address: string;
  bookingUrl?: string;
  driveTime?: string;
  roomBlocked?: boolean;
  reviewRating?: {
    score: number;
    outOf: number;
    source: string;
    url: string;
  };
  priceTier?: 1 | 2 | 3 | 4;
};

type LodgingHub = {
  id: string;
  name: string;
  description: string;
  hotels: Hotel[];
};

function burlingtonHotels(): Hotel[] {
  return [
    {
      name: 'Baymont by Wyndham Burlington',
      address: '750 Fox Lane, Waterford, WI 53185',
      driveTime: '12 min',
      priceTier: 1,
      roomBlocked: false,
      bookingUrl: 'https://www.wyndhamhotels.com/baymont/waterford-wisconsin/baymont-inn-and-suites-waterford-burlington-wi',
      reviewRating: {
        score: 3.6,
        outOf: 5,
        source: 'Tripadvisor',
        url: 'https://www.tripadvisor.com/Hotel_Review-g60361-d263310-Reviews-Baymont_by_Wyndham_Waterford_Burlington_WI-Waterford_Wisconsin.html',
      }
    },
    {
      name: 'AmericInn by Wyndham Burlington',
      address: '2709 Browns Lake Dr, Burlington, WI 53105',
      driveTime: '8 min',
      priceTier: 2,
      roomBlocked: false,
      bookingUrl: 'https://www.wyndhamhotels.com/americinn/burlington-wisconsin/americinn-lodge-and-suites-burlington?iata=00093763&cid=PS:iff89yahuf6x1p9&cq_cmp=23829194860&gclsrc=aw.ds&gad_source=1&gad_campaignid=23829194860',
      reviewRating: {
        score: 3,
        outOf: 5,
        source: 'Tripadvisor',
        url: 'https://www.tripadvisor.com/Hotel_Review-g59742-d239876-Reviews-AmericInn_by_Wyndham_Burlington-Burlington_Wisconsin.html',
      }
    }
  ];
}

function lakeGenevaHotels(): Hotel[] {
  return [
    {
      name: 'Comfort Suites Lake Geneva East',
      address: '300 E Main St, Lake Geneva, WI 53147',
      driveTime: '19 min',
      priceTier: 3,
      roomBlocked: true,
      bookingUrl: 'https://www.choicehotels.com/reservations/groups/iu18n5',
      reviewRating: {
        score: 4.2,
        outOf: 5,
        source: 'Tripadvisor',
        url: 'https://www.tripadvisor.com/Hotel_Review-g60022-d578283-Reviews-Comfort_Suites_Lake_Geneva_East-Lake_Geneva_Wisconsin.html',
      }
    },
    {
      name: 'Fairfield by Marriott',
      address: '1111 N Edwards Blvd, Lake Geneva, WI 53147',
      driveTime: '16 min',
      priceTier: 4,
      roomBlocked: false,
      bookingUrl: 'https://www.marriott.com/search/findHotels.mi?searchType=InCity&destinationAddress.city=Lake+Geneva&destinationAddress.stateProvince=WI&destinationAddress.country=US&marriottBrands=FI&showMore=true&fromDate=10%2F01%2F2027&toDate=10%2F03%2F2027&flexibleDateSearch=false&clusterCode=corp&corporateCode=F6253&view=list#/0/',
      reviewRating: {
        score: 4.7,
        outOf: 5,
        source: 'Tripadvisor',
        url: 'https://www.tripadvisor.com/Hotel_Review-g60022-d578283-Reviews-Comfort_Suites_Lake_Geneva_East-Lake_Geneva_Wisconsin.html',
      }
    }
  ];
}

function elkhornHotels(): Hotel[] {
  return [
    {
      name: 'Hampton Inn Elkhorn',
      address: '40 W Hidden Trail, Elkhorn, WI 53121',
      driveTime: '22 min',
      priceTier: 2,
      roomBlocked: true,
      bookingUrl: 'https://www.hilton.com/en/book/reservation/rooms/?ctyhocn=JVLEKHX&arrivalDate=2027-10-01&departureDate=2027-10-03&groupCode=GSP&room1NumAdults=1&displayCurrency=USD&aarpRate=',
      reviewRating: {
        score: 4.3,
        outOf: 5,
        source: 'Tripadvisor',
        url: 'https://www.tripadvisor.com/Hotel_Review-g59858-d1237844-Reviews-Hampton_Inn_Elkhorn_Lake_Geneva_Area-Elkhorn_Wisconsin.html',
      }
    }
  ];
}

function kenoshaHotels(): Hotel[] {
  return [
    {
      name: 'Hampton Inn & Suites Kenosha',
      address: '7300 125th Ave, Kenosha, WI 53142',
      driveTime: '28 min',
      priceTier: 2,
      roomBlocked: true,
      bookingUrl: 'https://www.hilton.com/en/book/reservation/rooms/?ctyhocn=ENVWIHX&arrivalDate=2027-10-01&departureDate=2027-10-03&groupCode=90m&room1NumAdults=1&displayCurrency=USD&aarpRate=',
      reviewRating: {
        score: 4.5,
        outOf: 5,
        source: 'Tripadvisor',
        url: 'https://www.tripadvisor.com/Hotel_Review-g60003-d8325460-Reviews-Hampton_Inn_Suites_Kenosha_Pleasant_Prairie-Kenosha_Wisconsin.html',
      }
    }
  ];
}

const lodgingHubs: LodgingHub[] = [
  {
    id: 'burlington',
    name: 'Burlington',
    description: 'Make Burlington your base for a relaxed wedding weekend, with local places to eat and time to explore between celebrations.',
    hotels: burlingtonHotels(),
  },
  {
    id: 'lake-geneva',
    name: 'Lake Geneva',
    description: 'Turn your visit into a lakeside getaway, with time for a stroll, a meal out, and a little exploring before the wedding.',
    hotels: lakeGenevaHotels(),
  },
  {
    id: 'elkhorn',
    name: 'Elkhorn',
    description: 'A quieter home base for the weekend, with a small-town feel and room to settle in between wedding festivities.',
    hotels: elkhornHotels(),
  },
  {
    id: 'kenosha',
    name: 'Kenosha',
    description: 'Stay by Lake Michigan and make a weekend of it, with a lakefront visit and a chance to explore a different corner of southeastern Wisconsin.',
    hotels: kenoshaHotels(),
  }
];

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 7 2-4h10l2 4M4 7h16l1 4v7H3v-7l1-4ZM3 12h18M6 18v3m12-3v3M6 15h2m8 0h2" />
    </svg>
  );
}

export function Travel() {
  const [selectedHub, setSelectedHub] = useState(() =>
    lodgingHubs.find(hub => '#stay-' + hub.id === window.location.hash)?.id ?? lodgingHubs[0].id
  );

  useEffect(() => {
    const selectLinkedHub = () => setSelectedHub(
      lodgingHubs.find(hub => '#stay-' + hub.id === window.location.hash)?.id ?? lodgingHubs[0].id
    );
    window.addEventListener('hashchange', selectLinkedHub);
    return () => window.removeEventListener('hashchange', selectLinkedHub);
  }, []);

  return (
    <main id="content" className="travel-page" aria-label="Travel and Accommodation">
      <section className="travel-location" aria-labelledby="travel-location-title">
        <p className="travel-script">join us in</p>
        <h1 id="travel-location-title">Burlington, Wisconsin</h1>
        <p className="travel-date">October 2, 2027</p>
        <div className="travel-short-rule" aria-hidden="true" />
        <h2 className="travel-small-heading">The location</h2>
        <p className="travel-venue">Mercantile Hall</p>
        <img
          className="travel-venue-photo"
          src="/images/mercantile-hall-courtyard.jpg"
          width="900"
          height="600"
          alt="Mercantile Hall courtyard with wooden beams, string lights, and chairs arranged along the ceremony aisle"
          decoding="async"
        />
        <p className="travel-copy travel-venue-address">425 N Pine St, Burlington, WI 53105</p>
        <p className="travel-copy travel-welcome">We can’t wait to celebrate with you! Below are four areas to consider for your stay, with hotel options and travel details to help you plan your weekend. Burlington is about an hour drive from both Chicago and Milwaukee, meaning you can fly into either international airport.</p>
      </section>
      <section className="travel-stays" aria-labelledby="travel-stays-title">
        <p className="travel-script">find your home for the weekend</p>
        <h2 id="travel-stays-title">Where to stay</h2>
        <div className="travel-hub-selector" role="group" aria-labelledby="travel-stays-title">
          {lodgingHubs.map(({ id, name }) => (
            <button
              key={id}
              type="button"
              aria-pressed={selectedHub === id}
              aria-controls="selected-lodging-hub"
              onClick={() => setSelectedHub(id)}
            >
              {name}
            </button>
          ))}
        </div>
        {lodgingHubs.filter(hub => hub.id === selectedHub).map(({ id, name, description, hotels }) => (
          <section className="travel-hub" id="selected-lodging-hub" key={id} aria-labelledby={'hub-' + id + '-title'}>
            <div className="travel-short-rule" aria-hidden="true" />
            <h2 id={'hub-' + id + '-title'}>{name}</h2>
            <p className="travel-copy travel-area-copy">{description}</p>
            <div className="travel-hotels">
              {hotels.map(hotel => (
                <article key={hotel.name}>
                  <h3>{hotel.name}</h3>
                  {(hotel.roomBlocked === true || hotel.reviewRating || hotel.priceTier) && (
                    <div className="travel-hotel-badges">
                      {hotel.roomBlocked === true && <span className="travel-hotel-pill travel-room-block">Room block available</span>}
                      {hotel.reviewRating && (
                        <a
                          className="travel-hotel-pill travel-review-rating"
                          href={hotel.reviewRating.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={'Guest review score ' + hotel.reviewRating.score + ' out of ' + hotel.reviewRating.outOf + ' on ' + hotel.reviewRating.source + '. View reviews'}
                        >
                          <span aria-hidden="true">★</span> {hotel.reviewRating.score}/{hotel.reviewRating.outOf} · {hotel.reviewRating.source}
                        </a>
                      )}
                      {hotel.priceTier && (
                        <span
                          className="travel-hotel-pill"
                          aria-label={'Estimated price level ' + hotel.priceTier + ' out of 4'}
                          title="Estimated relative nightly cost; actual rates vary by date and room"
                        >
                          {'$'.repeat(hotel.priceTier)}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="travel-copy travel-hotel-address">{hotel.address}</p>
                  <p className="travel-drive travel-hotel-time"><CarIcon /> Drive to venue · {hotel.driveTime ?? 'time to be confirmed'}</p>
                  {hotel.bookingUrl ? (
                    <a className="travel-booking" href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">{hotel.roomBlocked === true ? 'View Booking Link' : 'View website'} <span aria-hidden="true">↗</span></a>
                  ) : (
                    <button className="travel-booking" type="button" disabled aria-label={(hotel.roomBlocked === true ? 'Booking link' : 'Website link') + ' coming soon for ' + name + ' ' + hotel.name}>{hotel.roomBlocked === true ? 'View Booking Link' : 'View website'} <span aria-hidden="true">↗</span></button>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
