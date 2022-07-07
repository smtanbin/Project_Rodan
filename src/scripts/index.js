


const removeLoading = () => {
  const element = document.getElementById('main_content')
  if (element.classList.contains("d-none") === true) { return }
  else {
    document.getElementById("loading_animation").classList.add("d-none")
    element.classList.remove("d-none")
  }
}

const wait = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay))

// const logaccess =

const init = () => {
  document.addEventListener("DOMContentLoaded", () =>
    wait(3000).then(() => {
      removeLoading()
    })
  )
}
init()