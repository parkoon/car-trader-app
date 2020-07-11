import { GetServerSideProps } from 'next'
import { Formik, FormikProps, Form, Field } from 'formik'
import { getMakes, Make } from '../database/getMakes'
import { Paper, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 720,
    padding: theme.spacing(3),
  },
}))

export interface HomeProps {
  makes: Make[]
}

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000]

export default function Home({ makes }: HomeProps) {
  const classes = useStyles()
  const { query } = useRouter()

  const initialValues = {
    make: query.make || 'all',
    model: query.model || 'all',
    minPrice: query.minPrice || 'all',
    maxPrice: query.maxPrice || 'all',
  }
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Make</InputLabel>

                  <Field
                    name="make"
                    as={Select}
                    labelId="search-make"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem value={make.make}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                Model
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Min Price</InputLabel>

                  <Field
                    name="minPrice"
                    as={Select}
                    labelId="search-min-price"
                    label="Min Pricec"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem value={price}>{price}</MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Max Price</InputLabel>

                  <Field
                    name="maxPrice"
                    as={Select}
                    labelId="search-max-price"
                    label="Max Pricec"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem value={price}>{price}</MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const makes = await getMakes()
  return {
    props: {
      makes,
    },
  }
}
