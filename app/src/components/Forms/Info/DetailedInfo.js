/* eslint-disable prettier/prettier */
/** @jsx jsx */
import * as React from 'react';
import { css, jsx } from '@emotion/core';
import { Collapsable } from '@hackoregon/component-library';

const contentStyle = css`
  padding: 0 2em;
  max-width: 700px;
  margin: 12px auto;
  button {
    color: #5e63f6;
  }
`;

const DetailedInfo = () => (
  <>
    <section css={contentStyle}>
      <h2>About Small Donor Elections</h2>
      <p>
        <a
          href="https://www.portland.gov/smalldonorelections"
          target="_blank"
          rel="noopener noreferrer"
        >
          Small Donor Elections
        </a>{' '}
        is the City of Portland&apos;s small donor matching program. It is
        designed to ensure that the City government is accountable to all
        Portlanders, not just big campaign donors.
      </p>
      <p>
        The program is open to candidates for Mayor, Councilor District, and
        Auditor. To participate, they must show broad community support and
        accept contribution limits. The program provides a 9-to-1 match from the
        City’s Small Donor Elections Fund for the first $20 from any Portland
        donor.
      </p>
      <p>
        This real-time dashboard shows contribution sources for participating
        and non-participating candidates.
      </p>
      <Collapsable description="Small Donor Elections">
        <Collapsable.Section hidden>
          <h3>How it works</h3>
          <p>
            <i>
              This is a summary. See the{' '}
              <a
                href="https://www.portland.gov/smalldonorelections"
                target="_blank"
                rel="noopener noreferrer"
              >
                program website
              </a>{' '}
              for full details.
            </i>
          </p>
          <ul>
            <li>Candidates may opt into the program.</li>
            <li>
              To qualify, they must show that they have{' '}
              <strong>broad community support</strong> by collecting 250 small
              contributions from Portlanders if running for Council or Auditor
              or 750 small contributions if running for Mayor.
            </li>
            <li>
              Participating candidates must agree to contribution limits. They
              must{' '}
              <strong>
                agree to collect no more than $250 per donor and only from
                humans and small donor organizations, not businesses or
                political committees
              </strong>
              , with two exceptions:
              <ul>
                <li>
                  The first exception is that candidates may raise $500 per
                  donor up to $5,000 in “seed money” early on to get their
                  campaigns up and running.
                </li>
                <li>
                  The second exception is $5,000 of in-kind contributions. This
                  enables candidates to get <i>non-monetary</i> support from
                  organizations – either in pooled small contributions,
                  democracy building activities like organizing volunteer
                  canvassing, or goods and services to increase disability
                  accessibility or language inclusivity up to $5,000 per donor.
                </li>
              </ul>
            </li>
            <li>
              As candidates collect small contributions from Portlanders, the
              City matches them 9-to-1 on the first $20. So if you give a
              candidate $10 a month, the City will match that with $90 each time
              until you’ve given $20 and the City has provided the candidate
              $180 in matching funds for you.
            </li>
            <li>
              You can get matched for each race, so you could give to someone
              running for Mayor and get matched, and to candidates in each of
              the Commission races and get matched, and to a candidate in the
              Auditor’s race and get matched.
            </li>
          </ul>
          <h3>What it&apos;s for</h3>
          <p>
            Our government works best when every person is engaged in the
            elections process and can make a difference in the community. The
            program fosters an inclusive democratic process where everyone
            participates and everyone’s contributions matter. A community where
            people from all walks of life can run for and win office, while
            avoiding concerns about the influence of large donations in City
            elections.
          </p>
          <p>
            We’re strongest when our elected city leaders reflect the full range
            of talent and lived experience that Portland has to offer, and when
            the community trusts that elected leaders share the community’s
            values. People from every neighborhood in Portland should have
            meaningful opportunities to influence who is elected to City
            offices, and to run effective citywide campaigns.
          </p>

          <h3>About the software</h3>
          <p>
            This dashboard and the software that powers it was built in
            partnership between the City’s Small Donor Elections program and the{' '}
            <a
              href="https://civicsoftwarefoundation.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Civic Software Foundation
            </a>
            .
          </p>

          <p>
            The software is{' '}
            <a
              href="https://github.com/hackoregon/openelections/"
              target="_blank"
              rel="noopener noreferrer"
            >
              open-source
            </a>{' '}
            which means that anyone can scrutinize the code — which is essential
            for true transparency and accountability. It also means that other
            governments interested in visualizing their campaign finance data
            can use some or all of the open-source code.
          </p>

          <p>
            The software was built by an interdisciplinary team of volunteers
            and contractors working together through{' '}
            <a
              href="https://hackoregon.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hack Oregon
            </a>
            .
          </p>
        </Collapsable.Section>
      </Collapsable>
    </section>
    <section css={contentStyle}>
      <h2>About the data</h2>
      <p>
        This data is pulled live from the Small Donor Elections application. The
        dashboard shows all contribution information that has been submitted by
        campaigns, including contributions that are awaiting City review.
      </p>
      <Collapsable description="About this data">
        <Collapsable.Section hidden>
          <h3>Contribution process</h3>
          <p>
            A campaign submits contribution information through the Small Donor
            Elections application. City staff then review the contribution for
            matching eligibility and proper documentation, and may request
            clarification or changes from the campaign. Once any issues have
            been resolved, an eligible contribution can be approved for matching
            by City staff. An additional layer of review happens prior to
            payment from the Small Donor Elections Fund.
          </p>
          <p>
            Contributions are shown on the dashboard as soon as they are
            submitted by a campaign. Contribution information may be revised
            during the review process. The match information shown is what has
            been approved for matching by City staff, not what has actually been
            paid.
          </p>
          <h3>Public information and privacy</h3>
          <p>
            Although names and addresses of individual contributors is public
            information, the purpose of this dashboard is to show aggregate
            information. The map limits your ability to zoom in on precise
            locations and does not display contributor names.
          </p>
          <h3>Additional notes</h3>
          <p>
            The information above includes both monetary and non-monetary
            (in-kind) contributions. Program rules limit in-kind contributions
            to $5,000 from non-profit donors per election, either as pooled
            small contributions, in democracy-building activities, or in goods
            or services that increase disability accessibility or language
            inclusivity.
          </p>
          <p>
            When a contribution is on the border of a size category, it is
            grouped into the smaller category. So a $100 contribution would be
            included in the $25-$100 category, not the $100-$250 category.
          </p>
          <p>
            The contribution locations shown on the map is based on address
            geolocation from the Google Maps Geocoding API.
          </p>
          <p>
            Public matching contributions from the Small Donor Elections Fund
            are not shown on the map.
          </p>
        </Collapsable.Section>
      </Collapsable>
    </section>
  </>
);

export default DetailedInfo;
