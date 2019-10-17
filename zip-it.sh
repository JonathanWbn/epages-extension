#!/bin/bash

zip -r chrome ./extension* && cd extension && zip -r firefox ./** && mv firefox.zip ../