docker -v
if [ $? -ne 0 ] ; then
    echo "The program 'docker' is currently not installed."
    echo "\nInstalling Docker"
    sh docker-install.sh
else
    echo "Docker already installed"
fi
