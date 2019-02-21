import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Cookies from 'universal-cookie';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    List,
    Menu,
    Responsive,
    Segment,
    Sidebar,
    Form,
    Visibility,
} from 'semantic-ui-react'

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
    const isSSR = typeof window === 'undefined'

    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const App = () => (
    <div className="app-routes">
        <BrowserRouter>
        <Switch>
            <Route exact path="/" component={HomepageLayout} />
            <Route exact path="/products" component={ProductpageLayout} />
        </Switch>
        </BrowserRouter>
    </div>
);
/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
function SignInOrSignUp(props) {
    const isSignIn = props.isSignIn;
    if (isSignIn) {
        return <FormSignInForm/>;
    }
    return <FormSignUpForm/>;
}

function HomepageHeading(props) {
    return (
        <Container text>
            <Header
                as='h1'
                content='Welcome to Shutterfly'
                inverted
                style={{
                    fontSize:  '4em',
                    fontWeight: 'normal',
                    marginBottom: 0,
                    marginTop: '3em',
                }}
            />
            <Header
                as='h2'
                content='Get ready to make your memories forever.'
                inverted
                style={{
                    fontSize:  '1.7em',
                    fontWeight: 'normal',
                    marginTop: '1.5em',
                }}
            />
            <div class="ui divider"></div>
            <SignInOrSignUp isSignIn={props.isSignIn}/>
        </Container>
    )
}



/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class FormSignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag:""
        };
    }
    onChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [e.target.name]: e.target.value });
    }

    onBillingChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ billingAddress:{
            [e.target.name]: e.target.value
        }
        });
    }

    submit = () => {
        this.state.username=this.state.email;
        console.log(JSON.stringify(this.state));

        fetch("http://localhost:8080/users/sign-up", {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }) .then(res => res.ok ? res.status == 201? this.setState({flag:"User Successfully Created. Please login!"}):this.setState({flag:"Error Creating User. Please use a different username"}): res.json().then(err => Promise.reject(err)));

    }
    render(){

            return (
                <Container text>
                <Header
                    as='h2'
                    content={this.state.flag}
                    inverted
                    style={{
                        fontSize:  '1em',
                        fontWeight: 'normal',
                        marginBottom: '0.5em',
                        marginTop: '0.5em',
                    }}
                />
                <Form onSubmit={this.submit}>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <input placeholder='Name' name='name' onChange={this.onChange}/>
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Email' name='email' onChange={this.onChange} />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <input placeholder='Password' name='password' type='password' onChange={this.onChange} />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Confirm Password' type='password'/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <input placeholder='House Number' type='number' name='houseNumber' onChange={this.onBillingChange}/>
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Street Name' name='streetName' onChange={this.onBillingChange}/>
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='State' name='state' onChange={this.onBillingChange}/>
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='ZipCode' name='zipCode' onChange={this.onBillingChange}/>
                        </Form.Field>
                    </Form.Group>
                    <Button primary size='huge'>
                        Sign Up
                        <Icon name='right arrow'/>
                    </Button>
                </Form>
                </Container>
            )
        }
        }

class FormSignInForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flag:""
        }
    }

    onChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [e.target.name]: e.target.value });
    }

    addCookie = (res) => {
        var auth = res.headers.get('Authorization');
        const cookies = new Cookies();
        cookies.set('Authorization', auth, { path: '/' });
        console.log(auth);
        this.props.history.push("/products")
    }
    submit = () => {
        this.state.username=this.state.email;
        console.log(JSON.stringify(this.state));

        fetch("http://localhost:8080/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accepts':'application/json'
            },
            body: JSON.stringify(this.state)
        }) .then(res => res.ok ? res.status == 200? this.addCookie(res):this.setState({flag:"Invalid login. Please try again!"}): res.json().then(err => Promise.reject(err)));

    }
    render(){
        return (
            <Container text>
                <Header
                    as='h2'
                    content={this.state.flag}
                    inverted
                    style={{
                        fontSize:  '1em',
                        fontWeight: 'normal',
                        marginBottom: '0.5em',
                        marginTop: '0.5em',
                    }}
                />
            <Form onSubmit={this.submit}>
                <Form.Group widths='equal'>
                   <Form.Field>
                        <input placeholder='Email' name='email' onChange={this.onChange}/>
                    </Form.Field>
                    <Form.Field>
                        <input placeholder='Password' type='password' name='password' onChange={this.onChange}/>
                    </Form.Field>
                </Form.Group>
                <Button primary size='huge'>
                    Sign In
                    <Icon name='right arrow'/>
                </Button>
            </Form>
            </Container>
        )
    }
}

class DesktopContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {signIn: false}
    }
    signIn = () => {
        this.setState({
            signIn: !this.state.signIn
        })
    }
    hideFixedMenu = () => this.setState({ fixed: false })
    showFixedMenu = () => this.setState({ fixed: true })

    render() {
        const { children } = this.props
        const { fixed } = this.state

        return (
            <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
    <Visibility
        once={false}
        onBottomPassed={this.showFixedMenu}
        onBottomPassedReverse={this.hideFixedMenu}
    >
    <Segment
        inverted
        textAlign='center'
        style={{ minHeight: 700, padding: '1em 0em' }}
        vertical
        >
        <Menu
        fixed={fixed ? 'top' : null}
        inverted={!fixed}
        pointing={!fixed}
        secondary={!fixed}
        size='large'
        >
        <Container>
        <Menu.Item as='a' active>
        Home
        </Menu.Item>
           <Menu.Item position='right'>
        <Button as='a' inverted={!fixed} onClick={this.signIn}>
        Log in
        </Button>
        </Menu.Item>
        </Container>
        </Menu>
        <HomepageHeading isSignIn={this.state.signIn}/>
        </Segment>
        </Visibility>

        {children}
    </Responsive>
    )
    }
}

DesktopContainer.propTypes = {
    children: PropTypes.node,
}


const ResponsiveContainer = ({ children }) => (
<div>
<DesktopContainer>{children}</DesktopContainer>
</div>
)

ResponsiveContainer.propTypes = {
    children: PropTypes.node,
}

const ProductpageLayout = () => (
    <ResponsiveContainer>
        <Segment style={{ padding: '8em 0em' }} vertical>
            <Grid container stackable verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            "products Books"
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>Our talented designers will curate your photos and make a photo book for you. Buy it only if you like it!</p>
                    </Grid.Column >
                    <Grid.Column width={8}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            "Calendars, Cards & Much More"
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>You get to choose from a huge collection of themes for your custom calendars, cards and cups with your photos imprinted</p>
                    </Grid.Column >
                </Grid.Row>
            </Grid>
        </Segment>
    </ResponsiveContainer>
)
const HomepageLayout = () => (
<ResponsiveContainer>
<Segment style={{ padding: '8em 0em' }} vertical>
<Grid container stackable verticalAlign='middle'>
    <Grid.Row>
    <Grid.Column width={8}>
<Header as='h3' style={{ fontSize: '2em' }}>
"Photo Books"
</Header>
<p style={{ fontSize: '1.33em' }}>Our talented designers will curate your photos and make a photo book for you. Buy it only if you like it!</p>
</Grid.Column >
<Grid.Column width={8}>
<Header as='h3' style={{ fontSize: '2em' }}>
"Calendars, Cards & Much More"
</Header>
<p style={{ fontSize: '1.33em' }}>You get to choose from a huge collection of themes for your custom calendars, cards and cups with your photos imprinted</p>
</Grid.Column >
    </Grid.Row>
    </Grid>
</Segment>
</ResponsiveContainer>
)
export default App