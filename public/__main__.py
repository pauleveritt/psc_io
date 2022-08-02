"""Command-line interface for PSC."""
from pathlib import Path
from shutil import copytree

import typer
import uvicorn
from starlette.testclient import TestClient

from psc.app import app as web_app
from psc.here import HERE
from psc.resources import get_resources


app = typer.Typer()


def rmtree(root: Path) -> None:
    """Recursively remove everything in the target path."""
    for p in root.iterdir():
        if p.is_dir():
            rmtree(p)
        else:
            p.unlink()

    root.rmdir()


@app.command()
def build() -> None:  # pragma: no cover
    """Write the export to a public directory."""
    print("Building to the public directory")

    # If the target directory exists, remove it, then copy everything
    # under src/psc to the target
    public = HERE.parent.parent / "dist/public"
    if public.exists():
        rmtree(public)
    copytree(HERE, public)

    # Setup test client async with our app
    with TestClient(web_app) as test_client:
        # Render the home page then write to the output directory
        response = test_client.get("/")
        assert response.status_code == 200
        html = response.text
        output = public / "index.html"
        output.write_text(html)

        # Same for gallery page
        response = test_client.get("/gallery/index.html")
        assert response.status_code == 200
        html = response.text
        output = public / "gallery/index.html"
        with open(public / "gallery/index.html", "w") as f:
            f.write(html)

        # Now for each page
        resources = get_resources()
        for page in resources.pages.values():
            response = test_client.get(f"/pages/{page.path.stem}.html")
            output = public / f"pages/{page.path.stem}.html"
            output.write_text(response.text)

        # And for each example
        for example in resources.examples.values():
            url = f"/gallery/examples/{example.path.stem}/index.html"
            response = test_client.get(url)
            output = public / f"gallery/examples/{example.path.stem}/index.html"
            output.write_text(response.text)


@app.command()
def main(dry_run: bool = typer.Option(False, "--dry-run")) -> None:  # pragma: no cover
    """Default command, used to start the server."""
    # If running from the test, we don't want to actually start server
    if dry_run:
        print("Skipping server startup")
    else:
        print("Starting server")
        uvicorn.run("psc:app", port=3000, log_level="info")  # pragma: no cover


if __name__ == "__main__":  # pragma: no cover
    app()
