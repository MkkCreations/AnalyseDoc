import './styles/popUpInfo.css';

function PopUpInfo({message, loading = false}) {
    return (
        <div className="popUpInfo">
            <div className="popUpInfo__message">
                {message}
            </div>
            {loading? <p>Loading...</p> :''}
        </div>
    )
}

export default PopUpInfo;