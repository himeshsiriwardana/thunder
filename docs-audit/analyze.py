
import subprocess

def git(*args):
    result = subprocess.run(
        ["git", *args],
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout.strip()

def find_docs(term):
    result = subprocess.run(
        [
            "git", "grep", "-l", "-i",
            term,
            "v1.0.1",
            "--",
            "docs/content/"
        ],
        capture_output=True,
        text=True
    )

    if result.returncode == 1:
        return []

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    return [
        line.split(":", 1)[1]
        for line in result.stdout.splitlines()
    ]


commits = git(
    "log",
    "v1.0.0..v1.0.1",
    "--no-merges",
    "--format=%H"
).splitlines()

print(f"Found {len(commits)} commits\n")

for commit in commits:
    message = git("log", "-1", "--format=%s", commit)

    files = git(
        "diff-tree",
        "--no-commit-id",
        "--name-only",
        "-r",
        commit
    ).splitlines()

    docs = [
        path for path in files
        if path.startswith("docs/")
        and path.endswith((".md", ".mdx"))
    ]

    status = "DOCS UPDATED" if docs else "NO DOCS"

    internal_keywords = [
    "release bump",
    "frontport",
    "forward-port",
    "forward port",
    "dist-tag",
    "tools tree",
    "git action",
    "bump version",
    "version bump",
    ]

    is_internal = any(
    keyword in message.lower()
    for keyword in internal_keywords
    )

    category = "INTERNAL" if is_internal else "REVIEW"

    print(
    f"{commit[:9]} | {category} | {status} | {message}"
)

print("\n--- Documentation search test ---")

term = "ui_locales"

result = subprocess.run(
    [
        "git", "--no-pager", "grep",
        "-n", "-i",
        term,
        "v1.0.1",
        "--",
        "docs/content/"
    ],
    capture_output=True,
    text=True,
    check=False
)

if result.returncode == 0:
    print(result.stdout)
elif result.returncode == 1:
    print("No exact matches found.")
else:
    raise RuntimeError(result.stderr)
