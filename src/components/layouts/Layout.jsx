
export default function Layout(props) {
  const { children } = props

  return (
    <>
      <header>
        <h1 className="text-gradient">Compendious</h1>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <small>Created by</small>
        <a target="_blank" href="https://github.com/derick1129">
          <img alt="pfp" src="https://avatars.githubusercontent.com/u/170142927?v=4"/>
          <p>@derick1129</p>
          <i className="fa-brands fa-github"></i>
        </a>
      </footer>
    </>
  )
}
