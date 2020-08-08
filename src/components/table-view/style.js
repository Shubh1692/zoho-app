import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    appBar: {
        background: '#F8F8F8',
        flexGrow: 1
    },
    menuButton: {
        marginRight: 10,
    },
    title: {
        flexGrow: 1,
    },
    searchBox: {
        width: '100%',
        maxWidth: 250
    },
    header: {
        textTransform: 'uppercase'
    },
    noData: {
        fontSize: 'large',
        textAlign: 'center'
    }
});
export default useStyles;