import { MESSAGES } from '../../constants';

export default function HqTable({ data }) {
    if (!data.length) {
        return (
            <section className="stats-panel stats-panel-wide">
                <h2>{MESSAGES.STATS_SECTION_HQ}</h2>
                <p className="stats-no-data">{MESSAGES.STATS_NO_DATA}</p>
            </section>
        );
    }
    return (
        <section className="stats-panel stats-panel-wide">
            <h2>{MESSAGES.STATS_SECTION_HQ}</h2>
            <div className="stats-table-wrap">
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>{MESSAGES.STATS_HQ_NAME}</th>
                            <th>{MESSAGES.STATS_HQ_RESERVATIONS}</th>
                            <th>{MESSAGES.STATS_HQ_RENTALS}</th>
                            <th>{MESSAGES.STATS_HQ_REVENUE}</th>
                            <th>{MESSAGES.STATS_HQ_VEHICLES}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((hq) => (
                            <tr key={hq.headquartersId}>
                                <td className="stats-hq-name">{hq.headquartersName}</td>
                                <td>{hq.reservationCount ?? 0}</td>
                                <td>{hq.rentalCount ?? 0}</td>
                                <td className="stats-hq-revenue">{Number(hq.totalRevenue ?? 0).toLocaleString()} {MESSAGES.STATS_CURRENCY}</td>
                                <td>{hq.vehiclesAtHeadquarters ?? 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
