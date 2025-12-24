import { useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { client } from '../utils/httpClient';
import { Person } from '../types';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { PersonLink } from '../components/PersonLink';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { slug } = useParams();

  useEffect(() => {
    setErrorMessage('');
    setIsLoading(true);

    client
      .get('/people.json')
      .then(fetchedPeople => {
        if (fetchedPeople.length > 0) {
          for (const person of fetchedPeople) {
            person.mother =
              fetchedPeople.find(
                (mother: Person) => mother.name === person.motherName,
              ) || null;
            person.father =
              fetchedPeople.find(
                (father: Person) => father.name === person.fatherName,
              ) || null;
          }
        }

        setPeople(fetchedPeople || []);
      })
      .catch(error => {
        setErrorMessage('Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {isLoading && <Loader />}

          {!isLoading && errorMessage && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!isLoading && !errorMessage && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {!isLoading && !errorMessage && people.length > 0 && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(person => (
                  <tr
                    data-cy="person"
                    key={person.slug}
                    className={classNames({
                      'has-background-warning': slug === person.slug,
                    })}
                  >
                    <PersonLink person={person} />
                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    {person.mother && <PersonLink person={person.mother} />}

                    {!person.mother && person.motherName && (
                      <td>{person.motherName}</td>
                    )}

                    {!person.mother && !person.motherName && <td>-</td>}

                    {person.father && <PersonLink person={person.father} />}

                    {!person.father && person.fatherName && (
                      <td>{person.fatherName}</td>
                    )}

                    {!person.father && !person.fatherName && <td>-</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
