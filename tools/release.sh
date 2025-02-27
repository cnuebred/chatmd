#! /bin/bash

tag=$(git rev-parse --short HEAD)
are_changes=$(git status --porcelain)

# TODO