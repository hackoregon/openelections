# ======================================================================
# This is a template dockerfile for working on HackOregon data science
# projects locally on your laptop in 2019
# usage: docker run -ti -p 12345:8888 :latest
# within the container, use jupyter notebook with:
# $ jupyter notebook --ip 0.0.0.0 --no-browser --allow-root -v ${PWD}:/code/DataScience
# then navigate to your web browser and go to the url:
# 127.0.0.1:12345
# to see the notebook
# ======================================================================
FROM continuumio/miniconda3:latest
MAINTAINER Karen Ng <karen.yyng@gmail.com>

RUN conda config --add channels conda-forge
RUN conda upgrade -y conda && conda clean --all

RUN conda install \
	pyarrow=0.11.1 \
	pandas=0.24.2 \
	bokeh=1.0.4 \
	pytest=4.1.1 \
	sphinx=1.8.5 \
	jupyter=1.0.0 \
	matplotlib \
	xlrd=1.2.0 \
	statsmodels=0.9.0 \
	s3fs=0.2.0 \
	psycopg2=2.7.6.1 \
&& conda clean --all

RUN mkdir -p /project/root

WORKDIR /project/root

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade \
    recommonmark==0.5.0 \
    sphinx-markdown-tables \
    cookiecutter
